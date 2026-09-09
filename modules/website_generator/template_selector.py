import os
import json
import logging
from pathlib import Path
from typing import Dict, List, Optional, Tuple

from config.settings import TEMPLATES_DIR
from contracts.intelligence import WebsiteIntelligence
from contracts.template import TemplateMetadata
from modules.template_registry import TemplateRegistry

logger = logging.getLogger(__name__)


class TemplateSelector:
    """
    Selects the optimal Next.js template for a business using metadata-driven
    intelligence matching against the TemplateRegistry.
    
    Zero template metadata is hardcoded in Python; all template capabilities,
    industries, styles, and layout archetypes are discovered dynamically from
    the template library contract files.
    """

    def __init__(
        self,
        templates_dir: Optional[Path] = None,
        registry: Optional[TemplateRegistry] = None,
    ):
        self._registry = registry or TemplateRegistry(templates_dir)

    @property
    def registry(self) -> TemplateRegistry:
        """Underlying template registry instance."""
        return self._registry

    @property
    def available_templates(self) -> List[TemplateMetadata]:
        """Returns list of unique registered template metadata objects."""
        return self._registry.all_templates

    @property
    def runnable_templates(self) -> List[TemplateMetadata]:
        """Returns list of runnable template metadata objects."""
        return self._registry.runnable_templates

    def get_template(self, template_id: str) -> Optional[TemplateMetadata]:
        """Retrieves template by ID or directory name from the registry."""
        return self._registry.get_template(template_id)

    def _score_template(
        self,
        template: TemplateMetadata,
        recommended_template: str = "",
        template_category: str = "",
        style_direction: str = "",
        layout_pattern: str = "",
        industry: str = "",
    ) -> float:
        """
        Calculates a dynamic match score between business intelligence and template metadata.
        """
        score = 0.0

        # 1. Direct identifier / name match
        t_id_lower = template.id.lower()
        t_name_lower = template.name.lower()
        rec_tpl_lower = recommended_template.lower().strip().replace("_", "-")
        
        if rec_tpl_lower:
            if t_id_lower == rec_tpl_lower:
                score += 200.0
            elif t_id_lower in rec_tpl_lower or rec_tpl_lower in t_id_lower:
                score += 150.0
            elif rec_tpl_lower in t_name_lower:
                score += 100.0
            elif any(rec_tpl_lower in tag for tag in template.all_search_tags):
                score += 90.0

        # 2. Industry & Category match
        ind_lower = industry.lower().strip().replace("-", " ").replace("_", " ")
        cat_lower = template_category.lower().strip().replace("-", " ").replace("_", " ")
        ind_tokens = set(ind_lower.split()) if ind_lower else set()
        cat_tokens = set(cat_lower.split()) if cat_lower else set()

        for c in template.categories:
            c_low = c.lower().replace("-", " ").replace("_", " ")
            c_tokens = set(c_low.split())
            if cat_lower and (cat_lower in c_low or c_low in cat_lower):
                score += 60.0
            if ind_lower and (ind_lower in c_low or c_low in ind_lower):
                score += 50.0
            if ind_tokens and (ind_tokens & c_tokens):
                score += 35.0
            if cat_tokens and (cat_tokens & c_tokens):
                score += 30.0

        for i in template.industries:
            i_low = i.lower().replace("-", " ").replace("_", " ")
            i_tokens = set(i_low.split())
            if ind_lower and (ind_lower in i_low or i_low in ind_lower):
                score += 50.0
            if cat_lower and (cat_lower in i_low or i_low in cat_lower):
                score += 40.0
            if ind_tokens and (ind_tokens & i_tokens):
                score += 35.0
            if cat_tokens and (cat_tokens & i_tokens):
                score += 30.0

        # 3. Style direction match
        style_low = style_direction.lower().strip()
        if style_low:
            for s in template.style_keywords:
                s_low = s.lower()
                if s_low in style_low or style_low in s_low:
                    score += 30.0
            for v in template.supported_variants:
                v_low = v.lower()
                if v_low in style_low or style_low in v_low:
                    score += 20.0

        # 4. Layout pattern match
        layout_low = layout_pattern.lower().strip()
        if layout_low:
            for l in template.layout_patterns:
                l_low = l.lower()
                if l_low in layout_low or layout_low in l_low:
                    score += 25.0

        return score

    def select_template(
        self,
        intelligence: WebsiteIntelligence,
        template_override: Optional[str] = None,
        only_runnable: bool = False,
    ) -> TemplateMetadata:
        """
        Selects the best matching template from the library for the given intelligence.
        
        Selection precedence:
        1. Explicit manual override (verified runnable if only_runnable=True)
        2. Direct ID or tag match from intelligence recommendations
        3. Multi-criteria scored match (category, industry, style, layout)
        4. Universal fallback to a valid generic template
        """
        # Ensure registry has latest templates
        if not self._registry.all_templates:
            self._registry.discover_and_rebuild()

        # 1. Manual override
        if template_override:
            meta = self.get_template(template_override)
            if meta and (not only_runnable or meta.is_runnable):
                logger.info("Using manual template override: '%s' (%s)", meta.id, meta.name)
                return meta
            elif meta and only_runnable and not meta.is_runnable:
                logger.warning(
                    "Template override '%s' is a non-runnable metadata stub; falling back to auto-selection among runnable templates.",
                    template_override,
                )
            else:
                logger.warning("Template override '%s' not found in registry, proceeding to auto-selection.", template_override)

        # Extract intelligence matching criteria
        rec = intelligence.template_recommendation
        rec_tpl = (rec.recommended_template if rec else "").strip()
        rec_cat = (rec.template_category if rec else "").strip()
        rec_style = (rec.style_direction if rec else "").strip()
        rec_layout = (rec.layout_pattern if rec else "").strip()
        industry = (intelligence.business_profile.industry_category or "").strip()

        # Candidate pool
        candidates_pool = self._registry.runnable_templates if only_runnable else self._registry.all_templates
        if not candidates_pool:
            candidates_pool = self._registry.all_templates

        # Score candidates in pool
        candidates: List[Tuple[float, TemplateMetadata]] = []
        for tpl in candidates_pool:
            score = self._score_template(
                template=tpl,
                recommended_template=rec_tpl,
                template_category=rec_cat,
                style_direction=rec_style,
                layout_pattern=rec_layout,
                industry=industry,
            )
            candidates.append((score, tpl))

        # Sort by highest score first
        candidates.sort(key=lambda item: item[0], reverse=True)

        if candidates and candidates[0][0] > 0.0:
            best_score, best_tpl = candidates[0]
            logger.info("Selected best matching template: '%s' (score: %.1f)", best_tpl.id, best_score)
            return best_tpl

        # 4. Universal Fallback: Search for generic template
        fallback = self.get_template("generic-modern")
        if fallback and (not only_runnable or fallback.is_runnable):
            logger.info("Using universal generic fallback template: 'generic-modern'")
            return fallback

        if candidates_pool:
            first = candidates_pool[0]
            logger.info("Using first available template: '%s'", first.id)
            return first

        raise RuntimeError(f"No templates found in {self._registry.templates_dir}")

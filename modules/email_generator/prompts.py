from typing import Optional, List, Dict, Any
from contracts.intelligence import WebsiteIntelligence
from contracts.business import Business

PROMPT_VERSION = "1.0.0"

SYSTEM_INSTRUCTION = """You are a thoughtful, highly-skilled web developer and digital craftsman writing a personalized 1-on-1 outreach email to a business owner or team.

Your goal: You noticed specific areas for improvement on their current website, and you proactively rebuilt a modern, high-performance prototype for them to see in action.

STRICT WRITING RULES:
1. Grounded in Real Facts: Reference genuine specifics from their business (e.g. signature offerings, menu specialties, unique amenities, location details, or distinct value propositions). NEVER invent fake awards, fake clients, or fabricated facts.
2. Honest & Constructive Site Observations: Point out 1-2 specific, high-impact friction points or missed opportunities from their current site (e.g. lack of clear mobile booking/lead CTA, slow page load, outdated layout/typography, or missing local search markup) in a respectful, helpful way.
3. Introduce the Working Preview: Naturally mention that you put together a modern, live prototype to show how their brand can look and convert. Seamlessly include the live preview URL.
4. Human & Concise: Keep the email between 120 and 220 words (3 to 4 short paragraphs). Write like an independent human craftsperson, not an automated agency bot or sales script.
5. Low-Pressure, Respectful CTA: Use a zero-pressure close (e.g. "Feel free to check out the live preview here: [URL]. If you'd like to use this design or have me tweak anything, I'd be happy to send over the project files or chat for 5 minutes. No worries at all if you're happy with your current setup!").
6. BANNED Buzzwords & Spam Patterns:
   - NEVER use hype terms: "synergy", "game-changer", "revolutionary", "10x your revenue", "unlock unprecedented growth", "skyrocket", "cutting-edge AI solution".
   - NO spammy sales patterns: No fake urgency ("only 2 slots left"), no all-caps shouting, no aggressive follow-up threats.
   - Do NOT say "I hope this email finds you well" or "My name is X and I am reaching out to...". Start directly with something authentic and specific.
"""


def build_email_prompt(
    intelligence: WebsiteIntelligence,
    preview_url: str,
    business: Optional[Business] = None,
    recipient_email: Optional[str] = None,
) -> str:
    """
    Constructs the structured prompt for Gemini with rich context from WebsiteIntelligence and Business.
    """
    lines = []
    lines.append("# OUTREACH EMAIL GENERATION REQUEST")
    lines.append(f"Prompt Version: {PROMPT_VERSION}")
    
    # Business Identity
    biz_name = (
        (business.name if business and business.name else None)
        or (intelligence.business_profile.business_name if intelligence.business_profile else None)
        or intelligence.site_id
    )
    lines.append(f"\n## Target Business: {biz_name}")
    if intelligence.base_url:
        lines.append(f"- Current Website: {intelligence.base_url}")
    if business and business.category:
        lines.append(f"- Category: {business.category}")
    elif intelligence.business_profile.industry_category:
        lines.append(f"- Industry: {intelligence.business_profile.industry_category}")

    # Location / Contact
    loc_parts = []
    if business:
        if business.city:
            loc_parts.append(business.city)
        if business.state:
            loc_parts.append(business.state)
    if not loc_parts and intelligence.contact_intelligence:
        ci = intelligence.contact_intelligence
        if ci.city:
            loc_parts.append(ci.city)
        if ci.state_or_region:
            loc_parts.append(ci.state_or_region)
    if loc_parts:
        lines.append(f"- Location: {', '.join(loc_parts)}")

    # Target Email
    target_email = recipient_email
    if not target_email and business and business.email:
        target_email = business.email
    if not target_email and intelligence.contact_intelligence.emails:
        target_email = intelligence.contact_intelligence.emails[0]
    if target_email:
        lines.append(f"- Target Contact Email: {target_email}")
    else:
        lines.append("- Target Contact Email: (None publicly found)")

    # Live Preview URL
    lines.append(f"\n## Deployed Live Preview Website URL:\n{preview_url}")

    # Business Intelligence & Facts
    bp = intelligence.business_profile
    lines.append("\n## Business Value & Offerings:")
    if bp.tagline:
        lines.append(f"- Slogan / Tagline: {bp.tagline}")
    if bp.value_proposition:
        lines.append(f"- Value Proposition: {bp.value_proposition}")
    if bp.target_audience:
        lines.append(f"- Target Audience: {bp.target_audience}")
    if bp.key_differentiators:
        lines.append("- Standout Differentiators:")
        for diff in bp.key_differentiators[:4]:
            lines.append(f"  * {diff}")

    # Products / Services highlights
    if intelligence.services_and_products:
        lines.append("\n## Top Services / Offerings:")
        for s in intelligence.services_and_products[:4]:
            feat_str = f" ({', '.join(s.features[:3])})" if s.features else ""
            lines.append(f"- {s.name}: {s.description}{feat_str}")

    # Specific website weaknesses and opportunities
    lines.append("\n## Key Current Site Friction Points & Recommended Upgrades:")
    if intelligence.design_and_ux.weaknesses:
        lines.append("- Visual / UX Observations:")
        for w in intelligence.design_and_ux.weaknesses[:3]:
            lines.append(f"  * {w}")
    if intelligence.technical_and_seo.seo_weaknesses:
        lines.append("- Technical / SEO Observations:")
        for sw in intelligence.technical_and_seo.seo_weaknesses[:3]:
            lines.append(f"  * {sw}")
    if intelligence.redesign_recommendations.quick_wins:
        lines.append("- High-Impact Improvements Solved in New Prototype:")
        for qw in intelligence.redesign_recommendations.quick_wins[:3]:
            lines.append(f"  * {qw}")

    # Specific template direction
    if intelligence.template_recommendation:
        tr = intelligence.template_recommendation
        lines.append(f"\n## New Prototype Architectural Style:\n- Aesthetic: {tr.style_direction} ({tr.layout_pattern} layout)")
        if tr.key_sections:
            lines.append(f"- Key Interactive Sections: {', '.join(tr.key_sections[:5])}")

    lines.append("""
## INSTRUCTIONS FOR YOUR RESPONSE:
1. Craft an authentic, personalized subject line that feels like a peer message, not an ad.
2. In the body, reference specific facts from above, point out 1-2 constructive site improvements, introduce the new prototype with the exact preview URL, and end with a respectful low-pressure CTA.
3. If salutation_name can be inferred (e.g. from business name or contact info), include it.
4. List the key_improvements referenced in the email.
""")

    return "\n".join(lines)

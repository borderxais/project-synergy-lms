import logging
from typing import List, Dict, Any
from fastapi import HTTPException
from .openai_service import get_completion

logger = logging.getLogger('main')

async def search_web_results(query: str) -> str:
    """Search the web for college-related information."""
    try:
        # Search for latest news and admissions info
        search_queries = [
            f"{query} admissions requirements 2025",
            f"{query} application deadlines 2025",
            f"{query} latest news admissions",
            f"{query} acceptance rate trends"
        ]
        
        all_results = []
        for q in search_queries:
            results = await search_web(query=q, domain="")
            if results:
                all_results.extend(results)

        # Get content from top results
        content = []
        for result in all_results[:3]:  # Get content from top 3 results
            if result.get('url'):
                try:
                    doc_content = await read_url_content(result['url'])
                    if doc_content:
                        content.append(doc_content)
                except:
                    continue

        if not content:
            return "No recent news available."

        # Combine and summarize content
        combined_content = "\n".join(content)
        
        # Use OpenAI to summarize the content
        summary_prompt = f"""
        Summarize the following information about {query} admissions, focusing on:
        1. Latest requirements and deadlines
        2. Recent changes in admissions policy
        3. Key statistics and trends
        4. Important dates and deadlines
        
        Information:
        {combined_content}
        
        Provide a concise summary focusing on the most recent and relevant information.
        """
        
        summary = await get_completion(summary_prompt)
        return summary.strip()

    except Exception as e:
        logger.error(f"Error searching web results: {e}")
        return "Could not retrieve latest information."
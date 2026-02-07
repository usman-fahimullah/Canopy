/**
 * Email template variable renderer
 * Interpolates {{variable}} placeholders in template strings
 */

export function renderTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;

  // Replace all {{variable}} placeholders with actual values
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(placeholder, value || "");
  }

  return result;
}

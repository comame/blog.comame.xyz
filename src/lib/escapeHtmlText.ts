export function escapeHtmlText(text: string, xmlSafe = false): string {
    if (xmlSafe) {
        return text.replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    }
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

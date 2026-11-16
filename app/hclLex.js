export function lexHcl(source) {
    let output = '';
    let quoted = false, escaped = false, block = false, heredoc = null;
    const lines = source.split('\n');
    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
        const line = lines[lineNumber];
        if (lineNumber > 0)
            output += '\n';
        if (heredoc !== null) {
            if (line.trim() === heredoc) {
                output += line;
                heredoc = null;
            }
            else
                output += ' '.repeat(line.length);
            continue;
        }
        let index = 0, comment = false;
        while (index < line.length) {
            const c = line[index], next = line[index + 1];
            if (block) {
                if (c === '*' && next === '/') {
                    output += '  ';
                    block = false;
                    index += 2;
                }
                else {
                    output += ' ';
                    index++;
                }
                continue;
            }
            if (comment) {
                output += ' '.repeat(line.length - index);
                break;
            }
            if (quoted) {
                output += c;
                if (escaped)
                    escaped = false;
                else if (c === '\\')
                    escaped = true;
                else if (c === '"')
                    quoted = false;
                index++;
                continue;
            }
            if (c === '"') {
                quoted = true;
                output += c;
                index++;
                continue;
            }
            if (c === '/' && next === '*') {
                block = true;
                output += '  ';
                index += 2;
                continue;
            }
            if (c === '#' || (c === '/' && next === '/')) {
                comment = true;
                continue;
            }
            // HCL heredoc delimiter, including indented <<-EOT form.
            if (c === '<' && next === '<') {
                const match = /^<<-?([A-Za-z][\w]*)/.exec(line.slice(index));
                if (match) {
                    output += match[0];
                    index += match[0].length;
                    heredoc = match[1];
                    continue;
                }
            }
            output += c;
            index++;
        }
    }
    return { code: output, terminated: !quoted && !block && heredoc === null };
}

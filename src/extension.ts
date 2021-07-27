import * as vsc from 'vscode';

export function activate(context: vsc.ExtensionContext) {
	context.subscriptions.push(... [
		vsc.commands.registerCommand("bn-smart-clipboard.cut", async () => {
			vsc.window.showInformationMessage("bn-smart-clipboard.cut");
			await vsc.commands.executeCommand("editor.action.clipboardCutAction");
			await addToHistory();
		}),
		vsc.commands.registerCommand("bn-smart-clipboard.copy", async () => {
			vsc.window.showInformationMessage("bn-smart-clipboard.copy");
			await vsc.commands.executeCommand("editor.action.clipboardCopyAction");
			await addToHistory();
		}),
		vsc.commands.registerCommand("bn-smart-clipboard.paste", async () => {
			vsc.window.showInformationMessage("bn-smart-clipboard.paste");
			await addToHistory();
			await vsc.commands.executeCommand("editor.action.clipboardPasteAction");
		}),
		vsc.commands.registerCommand("bn-smart-clipboard.openHistory", async () => {
			vsc.window.showInformationMessage("bn-smart-clipboard.openHistory");
			const itemContent = await vsc.window.showQuickPick(history)
			if (itemContent) {
				await vsc.env.clipboard.writeText(itemContent);
				await addToHistory();
				await vsc.commands.executeCommand("editor.action.clipboardPasteAction");
			}
		}),
		vsc.commands.registerCommand("bn-smart-clipboard.pasteWithIndent", async () => {
			vsc.window.showInformationMessage("bn-smart-clipboard.pasteWithIndent");
			const tEditor = vsc.window.activeTextEditor;
			if (tEditor) {
				const 
					text = await addToHistory(),
					sels = tEditor.selections,
					EOL  = [0, "\n", "\r\n"][tEditor.document.eol],
					lines = text.split("\n"),
					indents = lines.map((v) => {
						const m = v.match(/^\s*/);
						return m ? m[0] : "";
					}),
					minIndLen = indents.length < 2 ? 0
						: indents.slice(1).reduce((a,v) => a < v.length ? a : v.length, Infinity);

				lines.forEach((v,i,a) => {
					console.log(`v`, v);
					if (i) 
						a[i] = v.slice(minIndLen);
					console.log(`a[i]`, a[i]);
				});
				let newText: string = "";
				if (lines.length === sels.length) {
					for (let [k, sel]of sels.entries()) {
						const indent = getFirstLIndent(tEditor, sel.start);
						newText += lines.join("\n" + indent);
					}
				} else {
					const indent = getFirstLIndent(tEditor, tEditor.selection.start);
					newText = lines.join("\n" + indent);
				}
				await vsc.env.clipboard.writeText(newText || text);
				await vsc.commands.executeCommand("editor.action.clipboardPasteAction");
			}
		}),
	]);
}

export function deactivate() {}

const history: string[] = [];


async function addToHistory() {
	const 
		text = await vsc.env.clipboard.readText(),
		maxHistoryLength = 50,
		index = history.indexOf(text);

	if (-1 < index) 
		history.splice(index, 1);
	history.unshift(text);

	const hLen = history.length;
	if (maxHistoryLength < hLen)
		history.splice(maxHistoryLength, Infinity);
	return text;
}

function getFirstLIndent(tEditor: vsc.TextEditor, pos: vsc.Position) {
	const 
		doc  = tEditor.document,
		lineText = doc.getText(doc.lineAt(pos).range),
		m = lineText.match(/^\s*/),
		indent = m ? m[0] : "";
	return indent;
}

function getIndents(tEditor: vsc.TextEditor) {
	const 
		doc  = tEditor.document,
		sels = tEditor.selections,
		indents = [];
	
	for (let [k, sel] of sels.entries()) {
		const 
			lineText = doc.getText(doc.lineAt(sel.start.line).range),
			m = lineText.match(/^\s*/),
			indent = m ? m[0] : "";	
		indents.push(indent);
	}

	return indents;
}
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
}

function sortSelections (sels: vsc.Selection[]) {
	sels.sort((a: vsc.Selection, b: vsc.Selection) => {
		if (a.active.line == b.active.line)
			return a.active.character - b.active.character;
		else
			return a.active.line - b.active.line;
	});
	return sels;
}


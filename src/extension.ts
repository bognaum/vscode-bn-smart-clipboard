import * as vsc from 'vscode';

export function activate(context: vsc.ExtensionContext) {
	context.subscriptions.push(... [
		vsc.commands.registerCommand("bn-smart-clipboard.cut", () => {
			vsc.window.showInformationMessage("bn-smart-clipboard.cut");
			addToHistory();
			vsc.commands.executeCommand("editor.action.clipboardCutAction");
		}),
		vsc.commands.registerCommand("bn-smart-clipboard.copy", () => {
			vsc.window.showInformationMessage("bn-smart-clipboard.copy");
			addToHistory();
			vsc.commands.executeCommand("editor.action.clipboardCopyAction");
		}),
		vsc.commands.registerCommand("bn-smart-clipboard.paste", () => {
			vsc.window.showInformationMessage("bn-smart-clipboard.paste");
			addToHistory();
			vsc.commands.executeCommand("editor.action.clipboardPasteAction");
		}),
		vsc.commands.registerCommand("bn-smart-clipboard.openHistory", () => {
			vsc.window.showInformationMessage("bn-smart-clipboard.openHistory");
			vsc.window.showQuickPick(history)
			.then((itemContent) => {
				if (itemContent)
					vsc.env.clipboard.writeText(itemContent)
						.then(() => {
							vsc.commands.executeCommand("editor.action.clipboardPasteAction");
						});
			});
		}),
	]);
}

export function deactivate() {}

const history: string[] = [];


function addToHistory() {
	vsc.env.clipboard.readText()
		.then((text) => {
			const 
				historyLength = 5,
				index = history.indexOf(text);
			if (-1 < index) 
				history.splice(index, 1);
			history.unshift(text);

			const hLen = history.length;
			if (historyLength < hLen)
				history.splice(historyLength, Infinity);
		});
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


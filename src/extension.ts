import * as vsc from 'vscode';

export function activate(context: vsc.ExtensionContext) {
	context.subscriptions.push(... [
		vsc.commands.registerCommand("bn-smart-clipboard.cut", () => {}),
		vsc.commands.registerCommand("bn-smart-clipboard.copy", () => {}),
		vsc.commands.registerCommand("bn-smart-clipboard.paste", () => {}),
		vsc.commands.registerCommand("bn-smart-clipboard.openHistory", () => {}),
	]);
}

// this method is called when your extension is deactivated
export function deactivate() {}

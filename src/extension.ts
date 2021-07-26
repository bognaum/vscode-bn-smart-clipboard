import * as vsc from 'vscode';

export function activate(context: vsc.ExtensionContext) {
	context.subscriptions.push(... [
		vsc.commands.registerCommand("bn-smart-clipboard.cut", () => {
			vsc.window.showInformationMessage("bn-smart-clipboard.cut");
		}),
		vsc.commands.registerCommand("bn-smart-clipboard.copy", () => {
			vsc.window.showInformationMessage("bn-smart-clipboard.copy");
		}),
		vsc.commands.registerCommand("bn-smart-clipboard.paste", () => {
			vsc.window.showInformationMessage("bn-smart-clipboard.paste");
		}),
		vsc.commands.registerCommand("bn-smart-clipboard.openHistory", () => {
			vsc.window.showInformationMessage("bn-smart-clipboard.openHistory");
		}),
	]);
}

// this method is called when your extension is deactivated
export function deactivate() {}

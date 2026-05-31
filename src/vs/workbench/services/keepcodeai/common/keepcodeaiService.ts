/*---------------------------------------------------------------------------------------------
 *  Copyright (c) KeepTG. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { registerSingleton, InstantiationType } from '../../../../platform/instantiation/common/extensions.js';

export interface IKeepCodeAIUser {
	id: number;
	username: string;
	email: string;
	plan: 'Free' | 'Pro' | 'Enterprise';
	api_calls: number;
	api_limit: number;
}

export interface IKeepCodeAIService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeAuthState: Event<boolean>;
	readonly onDidChangeUser: Event<IKeepCodeAIUser | null>;

	isAuthenticated(): boolean;
	getToken(): string | undefined;
	getUser(): IKeepCodeAIUser | null;
	signIn(token: string): Promise<IKeepCodeAIUser>;
	signOut(): void;
	validateToken(token: string): Promise<IKeepCodeAIUser>;
	canUseAI(): boolean;
}

export const IKeepCodeAIService = createDecorator<IKeepCodeAIService>('keepcodeaiService');

export class KeepCodeAIService extends Disposable implements IKeepCodeAIService {
	declare readonly _serviceBrand: undefined;

	private readonly _onDidChangeAuthState = this._register(new Emitter<boolean>());
	readonly onDidChangeAuthState: Event<boolean> = this._onDidChangeAuthState.event;

	private readonly _onDidChangeUser = this._register(new Emitter<IKeepCodeAIUser | null>());
	readonly onDidChangeUser: Event<IKeepCodeAIUser | null> = this._onDidChangeUser.event;

	private _token: string | undefined;
	private _user: IKeepCodeAIUser | null = null;

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		super();

		// Load saved token on startup
		this._loadSavedToken();
	}

	private _loadSavedToken(): void {
		const savedToken = this.configurationService.getValue<string>('keepcodeai.token');
		const savedUser = this.configurationService.getValue<IKeepCodeAIUser>('keepcodeai.user');

		if (savedToken && savedUser) {
			this._token = savedToken;
			this._user = savedUser;
			this._onDidChangeAuthState.fire(true);
			this._onDidChangeUser.fire(savedUser);
		}
	}

	isAuthenticated(): boolean {
		return !!this._token && !!this._user;
	}

	getToken(): string | undefined {
		return this._token;
	}

	getUser(): IKeepCodeAIUser | null {
		return this._user;
	}

	async signIn(token: string): Promise<IKeepCodeAIUser> {
		const user = await this.validateToken(token);

		this._token = token;
		this._user = user;

		this._onDidChangeAuthState.fire(true);
		this._onDidChangeUser.fire(user);

		return user;
	}

	signOut(): void {
		this._token = undefined;
		this._user = null;

		this.configurationService.updateValue('keepcodeai.token', undefined);
		this.configurationService.updateValue('keepcodeai.user', undefined);

		this._onDidChangeAuthState.fire(false);
		this._onDidChangeUser.fire(null);
	}

	async validateToken(token: string): Promise<IKeepCodeAIUser> {
		const response = await fetch('https://keepcodeai.com/api/auth/me', {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error('Invalid token');
		}

		const userData = await response.json();
		return userData as IKeepCodeAIUser;
	}

	canUseAI(): boolean {
		if (!this._user) {
			return false;
		}

		// Check if user has remaining API calls
		return this._user.api_calls < this._user.api_limit;
	}
}

registerSingleton(IKeepCodeAIService, KeepCodeAIService, InstantiationType.Delayed);

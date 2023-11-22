/// <reference types="lucia" />
declare namespace Lucia {
	type Auth = import("@/server/auth").Auth;

	type DatabaseUserAttributes = {
		username: string;
		avatar: string;
	};

	// eslint-disable-next-line @typescript-eslint/ban-types
	type DatabaseSessionAttributes = {};
}

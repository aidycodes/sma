// lucia.d.ts
/// <reference types="lucia-auth" />
declare namespace Lucia {
	type Auth = import("./auth/lucia.js").Auth;
	type UserAttributes = {
		userid: string;
	};
}
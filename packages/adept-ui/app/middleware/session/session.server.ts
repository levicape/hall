// app/services/session.server.ts
import { useSession } from "vinxi/http";

type SessionData = {
	token?: {
		id: string;
		expirationDate: Date;
		createdAt: Date;
		updatedAt: Date;
		user: {
			id?: string;
			username?: string;
		};
		userId: string;
	} | null;
};

export function useAppSession() {
	return useSession<SessionData>({
		password: "ChangeThisBeforeShippingToProdGoodLordThisCostMeSoMuchTime",
	});
}

// import { ITable } from "$server/client/ITable";
// import {
//   ProfileKey,
//   ProfileRow,
// } from "$accounts/model/profile/table/ProfileRow";
// import { ProfileNotFoundException } from "$accounts/model/exceptions/ProfileNotFoundException";
// import { ProfileTable } from "./ProfileTable";

// export class ProfileCollectionRepository {
//   constructor(private readonly storageClient: ITable<ProfileRow, ProfileKey>) {}

//   async create(row: ProfileRow): Promise<ProfileRow> {
//     await this.storageClient.post(row);
//     return row;
//   }

//   async readById(profileId: string[]): Promise<ProfileRow[]> {
//     const raw = await this.storageClient.getByMultiplePartitionIds(
//       profileId,
//       "#profile;" as ProfileKey["entity"],
//     );

//     if (raw === undefined || (Array.isArray(raw) && raw.length === 0)) {
//       throw new ProfileNotFoundException();
//     }
//     return raw;
//   }

//   async update(row: ProfileRow): Promise<ProfileRow> {
//     const updated = {
//       ...row,
//       lastUpdated: Date.now().toString(),
//     };

//     await this.storageClient.put(row.id, row.entity, updated);
//     return updated;
//   }
// }

// export const profileCollectionRepository = new ProfileCollectionRepository(
//   ProfileTable,
// );

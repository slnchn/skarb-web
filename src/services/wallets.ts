import { auth } from "@/auth";
import * as walletsRepository from "@/repositories/wallets";
import { ClientWalletDto, CreateWalletRequestDto } from "@/types/wallets";

export const getCurrentUserWallets = async (): Promise<ClientWalletDto[]> => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Non Authorized!");
  }

  const wallets = await walletsRepository.findByUser(session.user.id);
  return wallets.map((w) => ({
    ...w,
    latestBalanceTs: w.history[0]?.date?.toLocaleString() || null,
    latestBalance: w.history[0]?.moneyAmount || null,
  }));
};

export const createCurrentUserWallet = async (dto: CreateWalletRequestDto) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Non Authorized!");
  }

  const result = await walletsRepository.create({
    ...dto,
    ownerId: session.user.id,
  });

  return result;
};
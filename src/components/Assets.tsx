import TokenCard from "./TokenCard";

export default function Assets({ tokenInfo, totalBalance, loading } : { tokenInfo: any,totalBalance : number, loading: boolean }) {

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-gray-500 text-lg">
          Loading your assets...
        </span>
      </div>
    );
  }

  return (
    <div className={'flex flex-col h-[400px]'}>
      <div className="text-slate-600 text-lg font-sans">Your Assets</div>
      <div className="text-5xl font-bold">${totalBalance.toFixed(2)} <span className="text-2xl text-gray-500 font-bold">USD</span></div>
      <div className="mt-10 w-full">
        {tokenInfo?.map((token: any) => (
          <TokenCard key={token.mint} token={token} />
        ))}
      </div>
    </div>
  );
}

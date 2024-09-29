

export default function TokenCard({token} : {token : any}) {
    return (
        <div className="flex justify-between items-center w-[700px] p-2">
            <div className="flex gap-2 items-center">
                <img className="h-10 w-10 rounded-full" src={token.image} alt={token.name} />
                <div className="flex flex-col">
                    <p>{token.name}</p>
                    <p>1 {token.name} = ~${token.price.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <div className="font-semibold">$ {(token.price * token.balance).toFixed(2)}</div>
                <div className="font-medium">{token.balance.toFixed(2)} {token.name}</div>
            </div>
        </div>
    )

}
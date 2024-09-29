import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { SUPPORTED_TOKENS } from "@/constants/constant";
import { TokenDetail } from "./SwapTab";

export default function SwapInputRow({
  text,
  defaultToken,
  tokenBalances,
  inputDisable,
  onChange,
  quoteAmount,
  isQuoteAsset,
  inputLoading
}: {
  text: string;
  defaultToken: TokenDetail;
  tokenBalances: any;
  inputDisable? : boolean,
  onChange? : (e : any) => void
  quoteAmount? : number,
  isQuoteAsset? : boolean
  inputLoading? : boolean
}) {
  const [selectedToken, setSelectedToken] = useState<string>(defaultToken.name);
  const [inputValue, setInputValue] = useState<string>("");
  useEffect(() => {
    setSelectedToken(defaultToken.name);
    
    if(isQuoteAsset && quoteAmount) {
      setInputValue(quoteAmount.toString());
    }

  }, [defaultToken, quoteAmount, isQuoteAsset, inputLoading]);

  const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if(onChange) {
      onChange(e)
    }
   
  }

  return (
    <div className="flex items-center justify-between p-5 border border-black/55 rounded-xl group ">
      <div className="flex flex-col gap-3">
        {text}:
        <Select value={selectedToken} onValueChange={setSelectedToken}>
          <SelectTrigger className="w-[180px]">
            <SelectValue>
              <div className="flex items-center gap-1.5">
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={
                    SUPPORTED_TOKENS.find(
                      (token) => token.name === selectedToken
                    )?.image
                  }
                  alt={selectedToken}
                />
                <p>{selectedToken}</p>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_TOKENS.map((token) => (
              <SelectItem key={token.name} value={token.name}>
                <div>
                  <div className="flex items-center gap-1.5">
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={token.image}
                      alt={token.name}
                    />
                    <p>{token.name}</p>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div>
          Current Balance:{" "}
          {tokenBalances?.find((token: any) => token.name === selectedToken)?.balance.toFixed(2) || 0} {selectedToken} 
        </div>
      </div>
      <div className="flex">
        <Input
          type="number"
          className="border-none ring-0 focus-visible:ring-0 text-4xl font-semibold"
          dir="rtl"
          placeholder={inputLoading ? "Loading..." :  isQuoteAsset ? quoteAmount?.toString() : "0"}
          onChange={handleInputChange}
          disabled={inputDisable}
          value={inputValue}
        />
      </div>
    </div>
  );
}

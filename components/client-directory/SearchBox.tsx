import { useState } from "react";
import { SearchBoxProps } from "@/types/client";

export function SearchBox({ onSearch }: SearchBoxProps) {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [accountType, setAccountType] = useState("Checking");

  const handleSearch = () => {
    onSearch({ name, birthday, accountType });
  };

  return (
    <div className="bg-white shadow-[0px_5px_15px_rgba(0,0,0,0.2)] border flex w-full max-w-[1278px] flex-col overflow-hidden pt-[35px] pb-[60px] px-10 rounded-[10px] border-[rgba(224,214,192,1)] border-solid max-md:max-w-full max-md:px-5">
      <div className="z-10 flex w-[696px] max-w-full items-stretch gap-2.5 flex-wrap">
        <div className="flex flex-col items-stretch text-[rgba(101,0,0,1)] grow shrink-0 basis-0 w-fit max-md:max-w-full">
          <h2 className="text-xl font-bold tracking-[-0.4px]">
            Client Directory
          </h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="self-stretch w-[107px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] bg-white h-[50px] text-[10px] font-normal tracking-[-0.2px] mt-[18px] rounded-[10px] border-2 border-[#650000] px-3"
          />
        </div>
        <div className="flex items-start font-normal mt-[42px] max-md:mt-10">
          <div className="relative">
            <input
              type="text"
              placeholder="MM / DD / YYYY"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-[151px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] bg-white min-h-[50px] text-base text-[rgba(224,224,224,1)] tracking-[-0.32px] mt-1.5 rounded-[10px] border-2 border-solid border-[#D9D9D9] px-3"
            />
            <label className="text-[rgba(69,69,69,1)] text-[10px] tracking-[-0.2px] absolute -top-5 left-2">
              Birthday
            </label>
          </div>
        </div>
      </div>
      <div className="relative">
        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          className="self-stretch w-[143px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] bg-white z-10 mt-[-29px] min-h-[50px] text-base text-[rgba(69,69,69,1)] font-normal tracking-[-0.32px] mr-[319px] rounded-[10px] border-2 border-solid border-[#D9D9D9] px-3 max-md:mr-2.5"
        >
          <option value="Checking">Checking</option>
          <option value="Savings">Savings</option>
        </select>
        <label className="text-[rgba(69,69,69,1)] text-[10px] font-normal tracking-[-0.2px] absolute -top-5 left-2">
          Account Type
        </label>
      </div>
      <div className="flex mt-[-50px] w-[309px] max-w-full items-stretch gap-5 justify-between">
        <button
          onClick={handleSearch}
          className="justify-center items-center border shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] bg-[#650000] flex min-h-[50px] w-[51px] h-[51px] rounded-[10px] border-solid border-black"
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c9b9032db9fadd09a87f14baa1ba06cfbce4f696?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-[23px] self-stretch my-auto"
            alt="Search"
          />
        </button>
        <div className="flex items-center gap-5">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/5375e854dfbe773aeb3ac7800f4316e4d36e47e8?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-7 self-stretch shrink-0 my-auto"
            alt="Icon 1"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/5d8305baf8bda08787a06ebed9355623212a1aae?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-7 self-stretch shrink-0 my-auto"
            alt="Icon 2"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/6e90055fea9bb0d4454f15560424539a9c7bc40f?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-[50px] self-stretch shrink-0 rounded-[100px]"
            alt="Profile"
          />
        </div>
      </div>
    </div>
  );
}

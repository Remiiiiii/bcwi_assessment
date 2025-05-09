import { useState } from "react";
import Image from "next/image";
import { SearchBoxProps } from "@/types/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SearchBox({ onSearch }: SearchBoxProps) {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [accountType, setAccountType] = useState("Checking");

  const handleSearch = () => {
    const normalizedBirthday = birthday.replace(/\s/g, "");
    onSearch({
      name,
      birthday: normalizedBirthday,
      accountType: accountType,
    });
  };

  return (
    <div className="bg-card text-card-foreground border rounded-lg shadow-md p-4 md:p-8 mb-8 max-w-[1198px] mx-auto">
      <div className="flex justify-between items-center mb-4 md:hidden">
        <h2 className="text-lg poppins-medium tracking-[-0.02em] text-[#650000]">
          Client Directory
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground w-9 h-9 p-0 flex items-center justify-center"
          >
            <Image
              src="/images/icons/fa-bell.png"
              alt="Notifications"
              width={24}
              height={24}
              className="object-contain"
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Settings"
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground w-9 h-9 p-0 flex items-center justify-center"
          >
            <Image
              src="/images/icons/fa-gear.png"
              alt="Settings"
              width={24}
              height={24}
              className="object-contain"
            />
          </Button>
          <div className="h-9 w-9 rounded-full relative overflow-hidden">
            <Image
              src="/images/icons/user-profile.png"
              alt="User profile"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
        <div>
          <h2 className="hidden md:block text-lg md:text-[20px] poppins-medium tracking-[-0.02em] text-[#650000] mb-4 md:mb-6 h-auto md:h-[30px] md:leading-[30px]">
            Client Directory
          </h2>
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
            <div className="relative w-full md:flex-grow md:min-w-[500px]">
              <span className="absolute -top-2 left-3 text-[10px] font-medium text-[#650000] bg-card px-1">
                Name
              </span>
              <Input
                id="search-name"
                type="text"
                aria-label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-[50px] rounded-[10px] border-2 border-[#650000] focus:ring-2 focus:ring-[#650000] focus:ring-offset-2 w-full text-sm px-3 pt-2 placeholder:text-[#E0E0E0] "
              />
            </div>
            <div className="relative w-full md:basis-[300px] md:shrink">
              <span className="absolute -top-2 left-3 text-[10px] font-medium text-[#454545] bg-card px-1 poppins-thin">
                Birthday
              </span>
              <Input
                id="search-birthday"
                type="text"
                placeholder="MM  / DD / YYYY"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="h-[50px] rounded-[10px] border-2 border-[#D9D9D9] focus:ring-2 focus:ring-[#650000] focus:ring-offset-2 w-full text-sm px-3 pt-2 placeholder:text-[#E0E0E0] poppins-thin"
              />
            </div>
            <div className="relative w-full md:basis-[250px] md:shrink">
              <span className="absolute -top-2 left-3 text-[10px] font-medium text-[#454545] bg-card px-1 z-10">
                Account Type
              </span>
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger
                  id="search-account-type"
                  aria-label="Account Type"
                  className="h-[50px] rounded-[10px] border-2 border-[#D9D9D9] focus:ring-2 focus:ring-[#650000] focus:ring-offset-2 w-full text-sm px-3 pt-2 pb-2 placeholder:text-[#E0E0E0] flex items-center poppins-thin"
                >
                  <SelectValue placeholder="Select Account Type" />
                </SelectTrigger>
                <SelectContent className="rounded-[10px] poppins-thin">
                  <SelectItem value="Checking">Checking</SelectItem>
                  <SelectItem value="Savings">Savings</SelectItem>
                  <SelectItem value="All">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSearch}
              aria-label="Search"
              className="bg-[#650000] hover:bg-[#500000] text-white w-full md:w-[52px] h-[50px] rounded-[10px] flex items-center justify-center p-0 md:shrink-0 mt-4 md:mt-0"
            >
              <Image
                src="/images/icons/fa-magnifying-glass.png"
                alt="Search"
                width={24}
                height={24}
                className="object-contain"
              />
            </Button>
          </div>
        </div>
        <div className="hidden md:flex items-center self-end md:self-start gap-2 mt-4 md:mt-0 md:pt-[calc(30px+1.5rem)] translate-y-[8px]">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground w-9 h-9 p-0 flex items-center justify-center"
          >
            <Image
              src="/images/icons/fa-bell.png"
              alt="Notifications"
              width={24}
              height={24}
              className="object-contain"
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Settings"
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground w-9 h-9 p-0 flex items-center justify-center"
          >
            <Image
              src="/images/icons/fa-gear.png"
              alt="Settings"
              width={24}
              height={24}
              className="object-contain"
            />
          </Button>
          <div className="h-9 w-9 rounded-full relative overflow-hidden">
            <Image
              src="/images/icons/user-profile.png"
              alt="User profile"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

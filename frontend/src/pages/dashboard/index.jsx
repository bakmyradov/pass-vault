import { useState } from "react";
import {
  useUserPasswordsQuery,
  useGetPasswordQuery,
} from "@/slices/passwordsSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CreatePasswordModal from "@/components/createPasswordModal";
import ShowPasswordModal from "@/components/showPasswordModal";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetDescription,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPasswordId, setSelectedPasswordId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: passwords = [], isLoading, refetch } = useUserPasswordsQuery();

  const {
    data: selectedPassword,
    isFetching: isFetchingPassword,
    refetch: refetchPassword,
  } = useGetPasswordQuery(selectedPasswordId, {
    skip: !selectedPasswordId,
  });

  // Filter passwords based on the search query
  const filteredPasswords = passwords.filter(
    (password) =>
      password.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      password.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return null;
  }
  return (
    <>
      <div className="min-h-screen px-20 flex py-10">
        <div className="w-full h-screen px-8">
          <div className="top flex justify-between items-center mb-4 pt-4">
            <h1 className="text-2xl">Passwords</h1>
            <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
              <SheetTrigger asChild>
                <Button>Create</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Create Password</SheetTitle>
                  <SheetDescription>
                    Create a new password for a service.
                  </SheetDescription>
                </SheetHeader>
                <CreatePasswordModal
                  onClose={() => {
                    setIsModalOpen(false);
                    refetch();
                  }}
                />
              </SheetContent>
            </Sheet>
          </div>
          <Input
            placeholder="Search passwords"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="items">
            <div className="flex items-center justify-between mt-4 flex-col gap-y-4">
              {filteredPasswords.map((password) => (
                <Sheet
                  key={password._id}
                  open={selectedPasswordId === password._id}
                  onOpenChange={(isOpen) => {
                    if (!isOpen) {
                      setSelectedPasswordId(null);
                    }
                  }}
                >
                  <SheetTrigger asChild>
                    <div
                      onClick={() => setSelectedPasswordId(password._id)}
                      className="item rounded-md px-4 py-2 border drop-shadow-sm w-full flex justify-between cursor-pointer hover:bg-gray-100"
                    >
                      <div className="left">
                        <h1 className="text-lg font-bold">
                          {password.service}
                        </h1>
                        <p className="text-gray-500">
                          Username:
                          <span className="text-gray-700 ml-1">
                            {password.username}
                          </span>
                        </p>
                      </div>
                    </div>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>{password.service} credentials</SheetTitle>
                      <SheetDescription>
                        View your credentials for {password.service}.
                      </SheetDescription>
                    </SheetHeader>
                    <ShowPasswordModal
                      isFetchingPassword={isFetchingPassword}
                      selectedPassword={selectedPassword}
                      selectedPasswordId={selectedPasswordId}
                      refetch={refetchPassword}
                    />
                  </SheetContent>
                </Sheet>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;

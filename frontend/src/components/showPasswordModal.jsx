import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { CopyIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
const showPasswordModal = ({ isFetchingPassword, selectedPassword }) => {
  return (
    <div className="w-full">
      {isFetchingPassword ? (
        <p>Loading...</p>
      ) : (
        <div className="mt-8 w-full">
          <div className="flex flex-col gap-y-4">
            <div className="w-full relative">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  type="text"
                  name="username"
                  value={selectedPassword.username}
                  readOnly
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedPassword.username);
                    toast.success("Username copied to clipboard", {
                      position: "bottom-right",
                    });
                  }}
                  size="icon"
                  className={
                    "absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer w-7 h-7"
                  }
                >
                  <CopyIcon />
                </Button>
              </div>
            </div>
            <div className="w-full relative">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  type="text"
                  name="password"
                  value={selectedPassword.password}
                  readOnly
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedPassword.password);
                    toast.success("Password copied to clipboard", {
                      position: "bottom-right",
                    });
                  }}
                  size="icon"
                  className={
                    "absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer w-7 h-7"
                  }
                >
                  <CopyIcon />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default showPasswordModal;

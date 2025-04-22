import {
    Bell,      // Notifications
    UserCircle, // Profile
    Menu,       // Mobile Nav Toggle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"; // Assuming Sheet is needed for mobile
import Sidebar from "./sidebar"; // Reuse sidebar content

export default function Topbar() {
    // TODO: Implement mobile navigation toggle (AC3)
    // TODO: Add real profile/notification logic later

    return (
        <header className="flex items-center justify-between h-16 px-4 bg-white dark:bg-neutral-800 border-b dark:border-neutral-700 flex-shrink-0">
            {/* Mobile Navigation Toggle - Shown only on small screens */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open sidebar</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        {/* Render Sidebar inside the sheet */}
                        <Sidebar />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Spacer for Mobile view to push icons right - Ensures icons stay right even when menu is present */}
            <div className="flex-1 md:hidden"></div>

            {/* Right-aligned icons - Always visible */}
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" aria-label="Notifications">
                    <Bell className="h-6 w-6" />
                    <span className="sr-only">Notifications</span>
                </Button>
                <Button variant="ghost" size="icon" aria-label="Profile">
                    <UserCircle className="h-6 w-6" />
                    <span className="sr-only">Profile</span>
                </Button>
            </div>
        </header>
    );
} 
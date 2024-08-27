import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Loader, Plus } from "lucide-react";
import { cn } from "@/lib/utils";


export const WorkspaceSwitcher = () => {
    const router = useRouter()
    const workspaceId = useWorkspaceId();
    const [_open, setOpen] = useCreateWorkspaceModal()

    const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
        id: workspaceId
    });

    const filterWorkspaces = workspaces?.filter(
        (workspace) => workspace?._id !== workspaceId
    );


    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div
                    className={cn(
                        "size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-xl text-slate-800 font-semibold inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    )}
                >
                    {workspaceLoading ? (
                        <Loader className="size-5 animate-spin shrink-0" />
                    ) : (
                        workspace?.name.charAt(0).toUpperCase()
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start" className="w-64">
                <DropdownMenuItem
                    onClick={() => router.push(`/workspace/${workspaceId}`)}
                    className="overflow-hidden cursor-pointer flex-col justify-start items-start capitalize"
                >
                    {workspace?.name}
                    <span className="text-xs text-muted-foreground">
                        Active workspace
                    </span>
                </DropdownMenuItem>
                {filterWorkspaces?.map((workspace) => (
                    <DropdownMenuItem
                        key={workspace._id}
                        className="cursor-pointer capitalize overflow-hidden"
                        onClick={() => router.push(`/workspace/${workspace._id}`)}
                    >
                        <div className="shrink-0 size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md flex items-center justify-center mr-2">
                            {workspace?.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="truncate">
                            {workspace.name}
                        </p>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setOpen(true)}
                >
                    <div className="size-9 relative overflow-hidden bg-[#F2F2F2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
                        <Plus />
                    </div>
                    Create a new workspace
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { FaCaretDown } from "react-icons/fa";

import { useToggle } from 'react-use';


interface WorkspaceSectionProps {
    label: string;
    children: React.ReactNode;
    hint: string;
    onNew?: () => void;
}

export const WorkspaceSection = ({
    label,
    children,
    hint,
    onNew
}: WorkspaceSectionProps) => {
    const [on, toggle] = useToggle(true);

    return (
        <div className="flex flex-col mt-3 px-2 space-y-1">
            <div className="flex items-center px-3.5 group">
                <Button
                    variant={"transparent"}
                    className="p-0.5 text-sm text-[#f9edffcc] shrink-0 size-6"
                    onClick={toggle}
                >
                    <FaCaretDown className={cn(
                        "size-4 -rotate-90 transition-transform",
                        on && "rotate-40"
                    )} />
                </Button>
                <Button
                    variant={"transparent"}
                    size={"sm"}
                    className="group px-1.5 text-sm h-[28px] text-[#f9edffcc] justify-start overflow-hidden items-center"
                >
                    <span className="truncate">{label}</span>
                </Button>
                {onNew && (
                    <Hint
                        label={hint}
                        side="top"
                        align="center"
                    >
                        <Button
                            onClick={onNew}
                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-[#f9edffcc] size-6 shrink-0"
                            variant={"transparent"}
                            size={"iconSm"}
                        >
                            <PlusIcon className="size-5" />
                        </Button>
                    </Hint>
                )}
            </div>
            {on && children}
        </div>
    )
}

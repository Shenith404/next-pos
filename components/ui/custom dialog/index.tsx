import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { ReactNode } from 'react';

interface MyDialogProps {
    btnName: any;
    btnSize?: "sm" | "lg" | "default" | "icon";
    btnVaraient?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    btnStyle?: string;
    dialogTitle: string | null;
    dialogDescription: string;
    formElements: ReactNode;
    dialogWidth?: string;
}

export default function MyDialog({
    btnName,
    btnSize,
    btnVaraient: btnVariant,
    btnStyle,
    dialogTitle = null,
    dialogDescription,
    formElements,
    dialogWidth

}: MyDialogProps) {

    return (
        <Dialog  >
            <DialogTrigger asChild>
                <Button className={btnStyle} variant={btnVariant || 'outline'} size={btnSize || 'sm'}>{btnName}</Button>
            </DialogTrigger>
            <DialogContent onInteractOutside={(e) => {
                e.preventDefault();
            }} className={` ${dialogWidth ? dialogWidth : "sm:max-w-[425px]"} w-full max-h-[85%] overflow-y-scroll`}>
                <DialogHeader hidden={dialogTitle === null}>
                    <DialogTitle  >{dialogTitle}</DialogTitle>
                    <DialogDescription>
                        {dialogDescription}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid  gap-4 py-4 ">
                    {formElements}
                </div>
                {/* <DialogFooter>
                    <Button type="button" onClick={onSubmit}>Save changes</Button>
                </DialogFooter> */}

            </DialogContent>

        </Dialog>
    );
}

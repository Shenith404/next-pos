// import { Button } from "@/components/ui/button";
// import {
//     Dialog,
//     DialogClose,
//     DialogContent,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger
// } from "@/components/ui/dialog";
// import { ReactNode } from 'react';

interface MyDialogProps {
    btnName: string | ReactNode;
    btnSize?: "sm" | "lg" | "default" | "icon";
    btnVaraient?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    btnStyle?: string;
    dialogTitle: string;
    dialogDescription?: string;
    formElements: ReactNode;
    onClick: () => void;
}


import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ReactNode } from "react";
import { Button } from "../button";

export default function ConfirmDialog(
    {
        btnName,
        btnSize,
        btnVaraient: btnVariant,
        btnStyle,
        dialogTitle,
        dialogDescription,
        onClick,
    }: MyDialogProps
) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={btnVariant} size={btnSize} className={btnStyle}>{btnName}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {dialogDescription || 'This action cannot be undone. This will permanently delete and remove your data from our servers.'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel  >Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-500" onClick={onClick}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

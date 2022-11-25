import React, {memo} from "react";
import {Button} from "@mui/material";

type ButtonWithMemo = {
    variant: 'text' | 'outlined' | 'contained'
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
    onClick: () => void
    title: string
}
export const ButtonWithMemo = memo((props: ButtonWithMemo) => {
    return <Button variant={props.variant}
                   onClick={props.onClick}
                   color={props.color}
    >
        {props.title}
    </Button>

})

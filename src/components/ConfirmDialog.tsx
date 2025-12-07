import { type Pokemon } from "../lib/pokemonCache";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface ConfirmDialogProps {
  pokemon: Pokemon | null;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  pokemon,
  open,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!pokemon) return null;

  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="bg-pokedex-lcd border-transparent font-pixel">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-pokedex-lcd-text text-sm uppercase">
            Choose {pokemon.name}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-[10px]">
            You are about to enter battle with{" "}
            <span className="text-accent uppercase">{pokemon.name}</span> (#{pokemon.id.toString().padStart(3, "0")}).
            Are you ready?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-center py-4">
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="w-24 h-24 object-contain"
          />
        </div>

        <AlertDialogFooter className="flex gap-2">
          <AlertDialogCancel
            onClick={onCancel}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 text-[10px] uppercase border-none"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-accent text-accent-foreground hover:bg-accent/80 text-[10px] uppercase"
          >
            Battle!
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

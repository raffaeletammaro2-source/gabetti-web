import { Heart } from "lucide-react";
import { toggleFavorite, useFavorites } from "@/lib/favorites";

const FavoriteButton = ({ id, className = "" }: { id: string; className?: string }) => {
  const on = useFavorites().includes(id);
  return (
    <button type="button" aria-pressed={on} aria-label={on ? "Rimuovi dai preferiti" : "Salva nei preferiti"}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(id); }}
      className={`rounded-full bg-background/90 p-2 shadow transition-transform hover:scale-110 ${className}`}>
      <Heart className={`h-5 w-5 ${on ? "fill-primary text-primary" : "text-foreground"}`} />
    </button>
  );
};
export default FavoriteButton;

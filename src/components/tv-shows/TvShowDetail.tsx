import { TvShowDetailContainer } from "./TvShowDetailContainer";

interface TvShowDetailProps {
  tvShowId: string;
  onClose: () => void;
  onTvShowRemoved: (tvShowId: string) => void;
}

export const TvShowDetail = ({ tvShowId, onClose, onTvShowRemoved }: TvShowDetailProps) => {
  return <TvShowDetailContainer tvShowId={tvShowId} onClose={onClose} onTvShowRemoved={onTvShowRemoved} />;
};
// src/components/CatCard.tsx
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { LocationOn, Cake, FavoriteBorder, Favorite } from '@mui/icons-material';
import { calculateAge } from '../../utils/utils';
import { ICat } from '@/types';
import { useSnackbar } from 'notistack';
import { useRemoveVoteForCatMutation, useVoteForCatMutation } from '@/store/http/api/cats';
import { useState } from 'react';

type CatCardProps = {
  cat: ICat;
};

const CatCard: React.FC<CatCardProps> = ({ cat }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [voteForCat, { isLoading: isVoting }] = useVoteForCatMutation();
  const [removeVoteForCat, { isLoading: isRemovingVote }] = useRemoveVoteForCatMutation();
  const [currentCat, setCurrentCat] = useState(cat); // Local state to manage cat data
  const [disableVoteButton, setDisableVoteButton] = useState(false);

  const catBirth = new Date(currentCat.birthday).toDateString();

  const handleVote = async () => {
    setDisableVoteButton(true);
    try {
      let updatedCat;
      if (currentCat.likedByUser) {
        // Attempt to remove the vote
        updatedCat = await removeVoteForCat({ catId: currentCat.id! }).unwrap();
        enqueueSnackbar('Vote removed successfully', { variant: 'success' });
      } else {
        // Attempt to add a vote
        updatedCat = await voteForCat({ catId: currentCat.id! }).unwrap();
        enqueueSnackbar('Vote added successfully', { variant: 'success' });
      }
      // Update local cat state with the updated data
      setCurrentCat(updatedCat);
    } catch (error) {
      console.error('Error updating vote:', error);
      enqueueSnackbar('Failed to update vote', { variant: 'error' });
    } finally {
      setDisableVoteButton(false);
    }
  };

  return (
    <Card sx={{ m: 2, maxWidth: '30vw' }}>
      <CardMedia
        component="img"
        image={currentCat.image_url}
        alt={currentCat.name}
        sx={{ height: '15vw', width: '18.24vw' }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {currentCat.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <LocationOn fontSize="small" /> {currentCat.location}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Cake fontSize="small" /> Born: {catBirth}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          age: {calculateAge(catBirth)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Favorite food: {currentCat.favorite_food}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Height: {currentCat.height} cm, Weight: {currentCat.weight} kg
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          onClick={handleVote}
          size="small"
          color="primary"
          disabled={disableVoteButton || isVoting || isRemovingVote}
        >
          {currentCat.likedByUser ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />} Like (
          {currentCat.likeCount || 0})
        </Button>
      </CardActions>
    </Card>
  );
};

export default CatCard;

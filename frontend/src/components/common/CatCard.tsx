// src/components/CatCard.tsx
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { LocationOn, Cake, FavoriteBorder } from '@mui/icons-material';
import { calculateAge } from '../../utils/utils';
import { ICat } from '@/types';

type CatCardProps = {
  cat: ICat;
  onLike?: () => Promise<void>;
};

const CatCard: React.FC<CatCardProps> = ({ cat, onLike }) => {
  const catBirth = new Date(cat.birthday).toDateString();
  return (
    <Card sx={{ m: 2, maxWidth: '30vw' }}>
      <CardMedia component="img" image={cat.image_url} alt={cat.name} sx={{ height: '15vw', width: '18.24vw' }} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {cat.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <LocationOn fontSize="small" /> {cat.location}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Cake fontSize="small" /> Born: {catBirth}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          age: {calculateAge(catBirth)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Favorite food: {cat.favorite_food}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Height: {cat.height} cm, Weight: {cat.weight} kg
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={onLike} size="small" color="primary">
          {/* should change to Favorite when liked */}
          <FavoriteBorder fontSize="small" /> Like ({cat.likeCount || 0}){/* </FavoriteBorder> */}
        </Button>
      </CardActions>
    </Card>
  );
};

export default CatCard;

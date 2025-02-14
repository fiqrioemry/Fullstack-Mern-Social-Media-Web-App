import {
  CircleUserRound,
  Compass,
  HomeIcon,
  Search,
  SquarePlus,
} from 'lucide-react';

// authentication state & control
export const signInState = {
  identifier: '',
  password: '',
};

export const signInControl = [
  {
    name: 'identifier',
    label: 'email / username',
    type: 'email',
    placeholder: 'Enter your email / username ',
    component: 'input',
  },
  {
    name: 'password',
    label: 'password',
    type: 'password',
    placeholder: 'Enter your password ',
    component: 'input',
  },
];

// delete later
export const initialPostForm = {
  content: '',
};

export const signUpState = {
  username: '',
  fullname: '',
  email: '',
  password: '',
};

export const signUpControl = [
  {
    name: 'username',
    label: 'username',
    type: 'text',
    placeholder: 'Enter your username ',
    component: 'input',
  },
  {
    name: 'fullname',
    label: 'fullname',
    type: 'text',
    placeholder: 'Enter your fullname ',
    component: 'input',
  },
  {
    name: 'email',
    label: 'email ',
    type: 'email',
    placeholder: 'Enter your email  ',
    component: 'input',
  },
  {
    name: 'password',
    label: 'password',
    type: 'password',
    placeholder: 'Enter your password ',
    component: 'input',
  },
];

export const profileState = {
  email: '',
  username: '',
  avatar: '',
  fullname: '',
  bio: '',
  birthday: '',
  gender: '',
  isPrivate: '',
};

export const profileControl = [
  {
    name: 'fullname',
    label: 'fullname',
    type: 'text',
    placeholder: 'Enter your name here',
    component: 'input',
  },
  {
    name: 'bio',
    label: 'bio',
    type: 'text',
    placeholder: 'Enter your bio here',
    component: 'textarea',
  },
  {
    name: 'birthday',
    label: 'birthday',
    type: 'date',
    placeholder: 'Add your birthday',
    component: 'input',
  },
  {
    name: 'gender',
    label: 'gender',
    type: 'select',
    placeholder: 'Select your gender',
    component: 'select',
    options: ['male', 'female'],
  },
];

export const postState = {
  images: [],
  content: '',
};

export const postControl = [
  {
    name: 'images',
    label: 'images',
    placeholder: 'Maks. 5 Image and less than 1mb each',
    component: 'upload',
  },
  {
    name: 'content',
    type: 'text',
    placeholder: 'Write a post',
    component: 'textarea',
  },
];

export const commentState = {
  postId: null,
  content: '',
  parentId: null,
};

export const commentControl = [
  {
    name: 'content',
    label: 'content',
    type: 'text',
    placeholder: 'Write a comment',
    component: 'input',
  },
];

export const sidebarConfiguration = ({
  handleNavigate,
  handleOpenModal,
  handleSearch,
}) => [
  {
    icon: HomeIcon,
    action: () => handleNavigate(''),
    title: 'home',
  },
  {
    icon: CircleUserRound,
    action: () => handleNavigate(`/profile`),
    title: 'profile',
  },
  {
    icon: Compass,
    title: 'explore',
    action: () => handleNavigate('explore'),
  },
  {
    icon: Search,
    action: () => handleSearch('search'),
    title: 'search',
  },
  {
    icon: SquarePlus,
    action: () => handleOpenModal('create'),
    title: 'create',
  },
];

export const animateSearch = {
  close: {
    left: '-100%',
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
  open: {
    left: '75px',
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
};

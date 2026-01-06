import { FaGithub } from 'react-icons/fa6';
import { Button } from '../ui/button';

export function GitHub() {
    function onClick() {}

    return (
        <Button
            type='button'
            onClick={onClick}
            className='w-full'
            variant='outline'
        >
            <FaGithub /> Login with GitHub
        </Button>
    );
}

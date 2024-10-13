import Image from 'next/image';

const ImageDisplay: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
    return (
        <div>
            <Image src={imageUrl} alt="表示する画像" width={500} height={500} />
        </div>
    );
};

import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';

interface Props {
  url: string;
  title: string;
}

const ShareButtons = ({ url, title }: Props) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center space-x-4">
      <p className="font-bold">シェア:</p>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Twitterでシェア"
        className="text-gray-500 hover:text-blue-400"
      >
        <FaTwitter size={24} />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebookでシェア"
        className="text-gray-500 hover:text-blue-600"
      >
        <FaFacebook size={24} />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedInでシェア"
        className="text-gray-500 hover:text-blue-700"
      >
        <FaLinkedin size={24} />
      </a>
    </div>
  );
};

export default ShareButtons;

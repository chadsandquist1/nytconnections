import './BackToHome.css'

interface BackToHomeProps {
  showBackButton?: boolean;
  backLabel?: string;
  onBack?: () => void;
}

export const BackToHome: React.FC<BackToHomeProps> = ({
  showBackButton = true,
  backLabel = '← Back to Menu',
  onBack,
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.href = '/';
    }
  };

  if (!showBackButton) {
    return null;
  }

  return (
    <div className="back-to-home">
      <button className="back-to-home__button" onClick={handleBack}>
        {backLabel}
      </button>
    </div>
  );
};

export default BackToHome;

import './_smartLoading.scss';

interface SmartLoadingProps {
  type: 'initial' | 'skeleton' | 'more';
  count?: number;
  message?: string;
}

export const SmartLoading: React.FC<SmartLoadingProps> = ({ 
  type, 
  count = 4, 
  message = "Cargando focaccias..." 
}) => {
  
  if (type === 'initial') {
    return (
      <div className='smartLoading initial'>
        <div className="loadingAnimation">
          <div className="focacciaIcon">🫓</div>
          <div className="loadingDots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
        <p>{message}</p>
        <small>Preparando nuestras mejores focaccias para ti</small>
      </div>
    );
  }

  if (type === 'more') {
    return (
      <div className='smartLoading more'>
        <div className="moreLoadingSpinner">🔄</div>
        <span>Cargando más...</span>
      </div>
    );
  }

  // type === 'skeleton'
  return (
    <div className='smartLoading skeleton'>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="skeletonItem">
          <div className="skeletonImage"></div>
          <div className="skeletonContent">
            <div className="skeletonTitle"></div>
            <div className="skeletonText"></div>
            <div className="skeletonText short"></div>
            <div className="skeletonFooter">
              <div className="skeletonPrice"></div>
              <div className="skeletonButton"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
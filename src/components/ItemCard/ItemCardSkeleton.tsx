import './_itemCardSkeleton.scss'

export const ItemCardSkeleton = () => {
    return (
        <div className='itemCardSkeleton'>
            <div className='skeletonImageContainer'>
                <div className='skeletonShimmer'></div>
            </div>
            <div className='skeletonContent'>
                <div className='skeletonTitle'></div>
                <div className='skeletonDescription'>
                    <div className='skeletonLine'></div>
                    <div className='skeletonLine short'></div>
                </div>
                <div className='skeletonFooter'>
                    <div className='skeletonPrice'></div>
                    <div className='skeletonButton'></div>
                </div>
            </div>
        </div>
    )
}
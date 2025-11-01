import { FaInstagram, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import { handleWhatsAppClick } from '../../utils';
import './_connectCard.scss';

type ConnectCardProps = {
    title: string;
    description: string;
    link?: string;
    iconUrl: string;
}

export const ConnectCard = ({ title, description, iconUrl, link }: ConnectCardProps) => {
    const iconMap = {
        'WhatsApp': <FaWhatsapp className='connectCardIcon whatsappIcon' onClick={handleWhatsAppClick}/>,
        'Instagram': <FaInstagram className='connectCardIcon instagramIcon' />,
        'Map': <FaMapMarkerAlt className='connectCardIcon mapIcon' />,
    };

    return (
        <div className='connectCard'>
            <div className='connectCardIcon'>
                {iconMap[iconUrl as keyof typeof iconMap]}
            </div>
            <h3 className='connectCardTitle'>{title}</h3>
            {link ? <a href={link} target='_blank' className={iconUrl ? `connectCardDescription ${iconUrl}` : ''}>{description}</a> : <p className='connectCardDescription'>{description}</p>}
        </div>
    )
}

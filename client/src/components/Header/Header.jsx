import './Header.css'
import Logo from '../../assets/logo.png'

const Header = () => {
    return (
        <>
            <header>
                <img src={Logo} alt="Logo" className='header-logo'/>
                <h1>Opinionater</h1>
            </header>
        </>
    )
}

export default Header;
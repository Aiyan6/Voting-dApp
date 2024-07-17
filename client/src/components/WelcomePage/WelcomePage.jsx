import './WelcomePage.css'

const WelcomePage = ({connectWallet}) => {
    return (
        <div className="welcome-container">
            <h1>Welcome to Opinionater</h1>
            <h2>Please connect your Metamask account to continue</h2>
            <button onClick = {connectWallet}>Connect Metamask</button>
        </div>
    )
}

export default WelcomePage;
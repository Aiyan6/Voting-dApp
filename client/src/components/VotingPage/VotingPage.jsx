import "./Welcome.css"

const VotingPage = ({account, options, remainingTime, pollQuestion, handleOptionButtons, showButtons}) => {

    let decimalTime = remainingTime;
    let minutes = Math.floor(decimalTime);
    let fractionalPart = decimalTime - minutes;
    let seconds = Math.round(fractionalPart * 60);

    return (
        <section className="voting-page-container">
            <p>Metamask Account: {account}</p>
            <p>Remaining Time: {minutes}:{seconds}</p>
            <p>Question: {pollQuestion}</p>

            { showButtons ? 
                <p>You have voted</p>
            
            : (
                <div className="buttons-container">
                    <button className="yes-button" onClick={() => handleOptionButtons(0)}>Yes</button>
                    <button className="no-button" onClick={() => handleOptionButtons(1)}>No</button>
                </div>
            )}
            
            <table id="myTable" className="candidates-table">
                <thead>
                <tr>
                    <th>Option</th>
                    <th>Votes</th>
                </tr>
                </thead>
                <tbody>
                {options.map((option, index) => (
                    <tr key={index}>
                    <td>{option.name}</td>
                    <td>{option.voteCount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            
        </section>
    )
}

export default VotingPage;
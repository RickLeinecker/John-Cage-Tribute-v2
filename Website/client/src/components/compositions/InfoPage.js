import React from "react";

class InfoPage extends React.Component {
    render() {
        return(
            <div className='schedule'>
                <div className='dark-overlay'>
                    <div className='search-inner'>
                        <div className='search-box'>
                            <h1 className='large text-primary'>About John Cage</h1>
                            <span>
                                <div className='info-left'>
                                    <p className='landing-text'>
                                        John Cage was a composer who challenged the concept of music itself.
                                        Initially studying under an architect, he was told by his teacher that an architect must dedicate their life to architecture.
                                        This prompted Cage to leave the field, stating that he had other interests he wanted to pursue.
                                        He began composing music, and took a very mathematical approach, rather than an emotional one, to composition.
                                        Cage has made many strides in experimenting with what it means for music to “be” music.
                                        He toyed with the very definition of music until eventually coming up with his musical philosophy.
                                    </p>
                                    {/* <img src='' /> */}
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default InfoPage;
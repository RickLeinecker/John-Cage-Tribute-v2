import React from "react";
import jcpic2 from "../../img/jcpic2.JPG";

class InfoPage extends React.Component {
    render() {
        return(
            <div className='schedule'>
                <div className='dark-overlay'>
                    <div className='schedule-inner'>
                        <div className='schedule-box'>
                            <h1 className='large text-primary'>About John Cage</h1>
                            <div className='landing-bottom'>
                                <div className='info-left'>
                                    <p className='landing-text'>
                                        John Cage was a composer who challenged the concept of music itself.
                                        Initially studying under an architect, he was told by his teacher that an architect must dedicate their life to architecture.
                                        This prompted Cage to leave the field, stating that he had other interests he wanted to pursue.
                                        He began composing music, and took a very mathematical approach, rather than an emotional one, to composition.
                                        Cage has made many strides in experimenting with what it means for music to “be” music.
                                        He toyed with the very definition of music until eventually coming up with his musical philosophy.
                                        John Cage believed that there was no distinction between sound and music.
                                        If it made waves that disturbed the air, it was considered both music and sound to him.
                                        4’33” is John Cage's most famous piece, where the performer is instructed to not play their instrument at all.
                                        Cage also believed in stripping away the artist’s or performer’s control over the piece.
                                        Our site expands upon this belief and captures the 'music' around us.
                                    </p>
                                </div>
                                <img src={jcpic2} alt='John Cage Piano' width='485px' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default InfoPage;
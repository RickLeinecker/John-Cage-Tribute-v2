import React from 'react';
import './Pager.css';

class Pager extends React.Component {
    constructor(props) { 
       super(props);

       this.state = { 
        items: this.props.items, 
        pageCount: this.props.pageCount,
        }

        this.state = this.calculate(this.state, 1);
    }

    calculate(state, pageNo) {
        let currentPage = pageNo;
        let totalPages = Math.ceil(state.items.length / state.pageCount);

        if(currentPage > totalPages) {
            currentPage = totalPages;
        }

        let hasPreviousPage = currentPage == 1 ? false : true;
        let hasNextPage = currentPage == totalPages ? false : true;
        let first = (currentPage - 1) * state.pageCount;
        let last = first + state.pageCount;
        let filteredItems = state.items.slice(first, last);

        let newState = {
            items: state.items,
            filteredItems: filteredItems,
            currentPage: currentPage,
            totalPages: totalPages,
            pageCount: state.pageCount
        }

        return newState;
    }

    handleClick(pageNo, e) {
        e.preventDefault();
        this.setState((state, props) => {
            return this.calculate(state, pageNo);
        })
    }

    render() {
        let pageArray = new Array();
        let i = 1;
        for(i = 1; i <= this.state.totalPages; i++) {
            pageArray.push(i);
        }

        const pages = pageArray.map((idx) =>
        <a href="#" key={idx} onClick={this.handleClick.bind(this, idx)} className={idx == this.state.currentPage ? "is-active" : ""}>
            <li>
                {idx}
            </li>
        </a>
        );

        let propsToPass = {
            items: this.state.filteredItems,
        }

        return(
            <div>
                {this.props.render(propsToPass)}
                <div style={{ width: 720, margin: 0 }}>
                    <div className='container'>
                        <div className='pagination p1'>
                            <ul>
                                {this.state.currentPage != 1 ?
                                    <a href="#" onClick={this.handleClick.bind(this, this.state.currentPage - 1)}>
                                        <li></li>
                                    </a>
                                    : <span> </span>}
                                {pages}
                                {this.state.currentPage != this.state.totalPages ?
                                    <a href='#' onClick={this.handleClick.bind(this, this.state.currentPage + 1)}>
                                        <li></li>
                                    </a>
                                    : <span> </span>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Pager;
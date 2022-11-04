import React from 'react';
import './Pager.css';

class Pager extends React.Component {
    constructor(props) { 
        super(props);

        this.state = { 
            items: this.props.items, 
            pageCount: this.props.pageCount,
        }

        console.log('Nowhere');
        this.state = this.calculate(this.state, 1);
    }

    componentDidUpdate(prevProps) {
        //this.state = this.calculate(this.state, 1);
    }

    calculate(state, pageNo) {
        console.log("Calculating...");
        // console.log(this.state.items);

        let currentPage = pageNo;
        console.log(`Page: ${currentPage} ${pageNo}`);
        let totalPages = Math.ceil(state.items.length / state.pageCount);

        // console.log(state);
        // console.log(pageNo);

        if(currentPage > totalPages) {
            currentPage = totalPages;
        }

        let hasPreviousPage = currentPage == 1 ? false : true;
        let hasNextPage = currentPage == totalPages ? false : true;
        let first = (currentPage - 1) * state.pageCount;
        let last = first + state.pageCount;
        let filteredItems = state.items.slice(first, last);

        console.log(`${first} ${last}`);

        // console.log("Filtered items...");
        // console.log(filteredItems);

        let newState = {
            items: state.items,
            filteredItems: filteredItems,
            currentPage: currentPage,
            totalPages: totalPages,
            pageCount: state.pageCount
        }

        console.log(`Current page!!!!! ${currentPage}`);

        return newState;
    }

    handleClick(pageNo, e) {
        console.log('handleclick');
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
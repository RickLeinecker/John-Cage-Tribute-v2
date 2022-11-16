import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import api from '../../utils/api';
import Spinner from '../layout/Spinner';
import CompList from "./CompList";
import Axios from "axios";
import Pager from './Pager.js';

class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchQuery: "",
			searchParam: "title",
			list: [],
		};
		this.searchbarChange = this.searchbarChange.bind(this);
		this.performSearch = this.performSearch.bind(this);
		this.changeSearchParam = this.changeSearchParam.bind(this);
		// this.pageRef = React.createRef();
		// this.listRef = React.createRef();
	}
	
	componentDidMount() {
		console.log("API");
		Axios.get("http://localhost:3001/recordings").then(r => {
			this.setState({list: r.data});
		})
	}

	componentDidUpdate() {
		// console.log("Update:");
		// console.log(this.pageRef.current.state);

		//this.pageRef.current.setState({items: this.state.list});
		//this.pageRef.current.calculate(this.pageRef.current.state, 1);
		// this.pageRef.current.render();

		// console.log("Updating pager?");
		// console.log(this.pageRef.current.state);
		

		console.log("update........");
	}
	
	render() {
		console.log("rendering!");
		console.log(this.state.list);
		const s = "search-params-button";
		const chosenStyle = {
			backgroundColor: "#adf"
		}
		var res, tagsStyle=null, titleStyle=null, composerStyle=null, performerStyle=null; 
		return (
			<div className='schedule'>
				<div className='dark-overlay'>
					<div className='search-inner'>
						<div className='search-box'>
							<Fragment>
								<form style={{textAlign:"center"}} onSubmit={this.performSearch}>
									<input type="text" id="search-bar" placeholder="Search" 
										value={this.state.searchQuery} onChange={this.searchbarChange} />
									<input className='btn btn-search' 
										onClick={this.performSearch} type="submit" value="Search"/>
								</form>
								<div style={{
									textAlign:"center",
									borderBottom:"2px solid #17a2b8",
									padding:"10px 0px"
								}}>
								</div>
								<div style={{padding:"10px"}}>
									{console.log("RIGHT BEFORE")}
									{console.log(this.state.list)}
									<CompList list={this.state.list} dash={false} />
								</div>
							</Fragment>
						</div>
					</div>
				</div>
			</div>
		);
	}
	
	searchbarChange(e) {
		this.setState({searchQuery: e.target.value})
	}
	
	performSearch(e) {
		var query = this.state.searchQuery;
		Axios.get("http://localhost:3001/title", {params: {query: query}}).then(r => {
			console.log("before setstate");
			console.log(this.state.list);
			this.setState({list: r.data});
			console.log("fixing");
			console.log(r.data);
			console.log(this.state.list);
			this.setState({list: r.data});
		})
		e.preventDefault();

		//this.setState({temp: 0});

		// const pageRef = this.pageRef;
		
		// pageRef.current.setState({items: this.state.list});

		// console.log("Current pageref state:");
		// console.log(pageRef.current.state);

		// pageRef.current.calculate(pageRef.current.state, 1);
		// pageRef.current.render();
	}
	
	changeSearchParam(str) {
		this.setState({
			searchParam: str
		})
	}
}

export default Search;
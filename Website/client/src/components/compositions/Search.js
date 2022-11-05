import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import api from '../../utils/api';
import Spinner from '../layout/Spinner';
import CompList from "./CompList";
import Axios from "axios";

class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchQuery: "",
			searchParam: "title",
			list: []
		};
		this.searchbarChange = this.searchbarChange.bind(this);
		this.performSearch = this.performSearch.bind(this);
		this.changeSearchParam = this.changeSearchParam.bind(this);
	}
	
	componentDidMount() {
		Axios.get("http://localhost:3001/recordings").then(r => {
			this.setState({list: r.data})
			console.log(r.data);
		})
	}
	
	render() {
		console.log(this.state.list);
		console.log("GELLO");
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
		console.log("Query: ", query);
		Axios.get("http://localhost:3001/title", {params: {query: query}}).then(r => {
			this.setState({list: r.data})
			console.log(r.data);
		})
		e.preventDefault();
	}
	
	changeSearchParam(str) {
		this.setState({
			searchParam: str
		})
	}
}

export default Search;
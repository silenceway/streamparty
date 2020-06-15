import React, { useEffect, useState } from 'react';
import './VideoSearch.css';
import { youtube_parser, validateYouTubeUrl } from '../VideoHelper';
import VideoSearchResults from './VideoSearchResults/VideoSearchResults';
import axios from 'axios';
import _ from 'lodash';

import { Input } from 'semantic-ui-react'

require('dotenv').config()

const VideoSearch = ({ addVideoToQueue, playVideoFromSearch }) => {
    const [searchInput, setSearchInput] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [page, setPage] = useState(1);
    const baseURL = process.env.REACT_APP_YT_SCRAPER;

    // useEffect(() => {
    //     let trimInput = searchInput.trim();
    //     let sendButtons = Array.from(document.getElementsByClassName('videoNavIcon'));
    //     // Update play/add to queue button color
    //     if (trimInput !== '') {
    //         if (validateYouTubeUrl(trimInput)) {
    //             sendButtons.map(button => button.classList.add('validReadyToPress'));
    //             sendButtons.map(button => button.classList.remove('readyToPress'));
    //         } else {
    //             sendButtons.map(button => button.classList.add('readyToPress'));
    //             sendButtons.map(button => button.classList.remove('validReadyToPress'));
    //         }
    //     } else {
    //         sendButtons.map(button => button.classList.remove('readyToPress'));
    //         sendButtons.map(button => button.classList.remove('validReadyToPress'));
    //     }
    // }, [searchInput]);

    const handlePlay = (event) => {
        let trimInput = searchInput.trim();
        event.preventDefault();
        if (validateYouTubeUrl(trimInput)) {
            // Reset the color after playing
            let sendButtons = Array.from(document.getElementsByClassName('videoNavIcon'));
            sendButtons.map(button => {
                button.classList.remove('readyToPress');
                button.classList.remove('validReadyToPress');
            });
            setSearchInput('')
            let videoId = youtube_parser(trimInput);
            search({ videoId });
        } else {
            // Search phrase on Youtube
            search({ term: trimInput, page: 1 });
        }
    };

    const videoSearch = async (term, page) => {
        axios.get(`${baseURL}/search`, {
            params: {
                query: term,
                page: page
            }
        }).then(response => {
            setSearchResults(response.data.results);
            // console.log(response.data.results, term);
            setPage(page);
            setSearching(false);
        });
    }
    const videoShow = async (videoId) => {
        axios.get(`${baseURL}/watch`, {
            params: { videoId }
        }).then(response => {
            setSearchResults(response.data.results);
            // console.log(response.data.results);
            setSearching(false);
        });
    }
    const search = _.debounce(({ term, page, videoId }) => {
        setSearching(true);
        // console.log(term, page, videoId);
        if (videoId === undefined) videoSearch(term, page)
        else videoShow(videoId);
    }, 5);

    useEffect(() => {
        // Establish connection with YT scraper
        search({ term: '' });
    }, []);

    return (
        <div className="videoSearchContainer">
            <Input
                fluid
                size='large'
                placeholder='Search a video or paste a YouTube link...'
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' ? handlePlay(e) : null}
                action={{
                    content: "Search",
                    onClick: (e) => searchInput.trim() !== '' ? handlePlay(e) : null
                }}
            />
            <VideoSearchResults
                searchResults={searchResults}
                playVideoFromSearch={playVideoFromSearch}
                addVideoToQueue={addVideoToQueue}
                page={page}
                search={search}
                searchInput={searchInput}
                searching={searching}
            />
        </div>
    )
};

export default VideoSearch;
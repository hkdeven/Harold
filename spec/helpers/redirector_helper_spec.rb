require 'spec_helper'

describe RedirectorHelper do
  describe "#redirect_to" do
    let(:url)           { "url" }
    let(:encrypted_url) { "encrypted url" }
    let(:length)        { double "length" }

    before do
      Rizzo::UrlEncryptor.stub(encrypt: encrypted_url)
      encrypted_url.stub(length: length)
      length.stub(:< => true)
    end
    
    it "encrypts the url" do
      Rizzo::UrlEncryptor.should_receive(:encrypt).with(url).and_return(encrypted_url)
      helper.redirector_to(url)
    end

    it "checks the length of the encrypted url against MAX_URL_LENGTH" do
      encrypted_url.should_receive(:length).and_return(length)
      length.should_receive(:<).with(RedirectorHelper::MAX_URL_LENGTH)
      helper.redirector_to(url)
    end

    context "when the encrypted url is reasonably short" do
      it "returns a path to the redirector controller show action for the encrypted url" do
        helper.redirector_to(url).should =~ /\/r/#{url}/
      end
    end

    context "when the encrypted url is too long" do
      before do
        encrypted_url.stub(length: length)
        length.stub(:< => false)
      end

      it "returns target_url" do
        helper.redirector_to(url).should eq url
      end
    end
  end
end
